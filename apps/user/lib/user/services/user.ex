defmodule User.Services.User do
  use GenServer
  import Joken

  @type user :: %{name: String.t, password: String.t, id: Integer.t}
  @type user_info :: %{name: String.t, password: String.t, id: Integer.t, token: String.t}
  @type user_auth_info :: %{name: String.t, password: String.t, id: Integer.t, token: String.t, id: integer}

  @type bad_request :: {:invalid, String.t, [{atom(), String.t}]}
  @type not_found :: {:enotfound, String.t, [any()]}
  @type internal :: {:internal, String.t, [any()]}
  @type unauthorized :: {:unauthorized, String.t, [{atom(), String.t}]}

  @salt Application.get_env(:user, :salt)
  @token_secret Application.get_env(:user, :token_secret)
  @empty_pass %{password: nil}
  @one_hour 3600

  @spec start_link([any()]) :: {:ok, pid()}
  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  @spec init(any()) :: {:ok, any()}
  def init(state), do: {:ok, state}

  @spec authenticate(%{name: String.t, password: String.t}) :: {:ok, user_info} | {:error, unauthorized} | {:error, internal}
  def authenticate(%{name: username, password: password}) do
    :poolboy.transaction(:user_pool, fn pid ->
      GenServer.call(pid, {:authenticate, %{name: username, password: password}})
    end)
  end

  @spec get(integer) :: {:ok, user_auth_info} | {:error, not_found}
  def get(id) do
    :poolboy.transaction(:user_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
  end

  @spec create(%{name: String.t, password: String.t}) :: {:ok, user}
  def create(%{name: name, password: password}) do
    :poolboy.transaction(:user_pool, fn pid ->
      GenServer.call(pid, {:create, %{name: name, password: password}})
    end)
  end

  def handle_call({:get, id}, _from, state) do
    user = case User.Repositories.User.get(id) do
      {:ok, nil} -> {:error, {:enotfound, "The user could not be found", []}}
      {:ok, user} -> {:ok, Map.merge(user, @empty_pass)}
    end
    {:reply, user, state}
  end

  def handle_call({:create, %{name: name, password: password}}, _from, state) do
    {:ok, hashed_pw} = :bcrypt.hashpw(password, @salt)
    hashed_pw = to_string(hashed_pw)
    new_user_payload = %{
      name: name,
      password: hashed_pw
    }

    result = case User.Repositories.User.create(new_user_payload) do
      {:error, reason} -> {:error, reason}
      {:ok, user} -> {:ok, Map.merge(user, @empty_pass)}
      _ -> {:error, {:internal, "Internal error", []}}
    end

    {:reply, result, state}
  end

  def handle_call({:authenticate, %{name: name, password: password}}, _from, state) do
    result = with {:ok, user}      <- find_user(%{name: name}),
                  {:ok, hashed_pw} <- :bcrypt.hashpw(password, @salt),
                  hashed_pw        <- to_string(hashed_pw),
                  {:ok, user_data} <- verify_user(user, hashed_pw)
    do
      sign_token_for_user(user_data)
    else
      error -> error
    end

    {:reply, result, state}
  end

  defp find_user(payload) do
    case User.Repositories.User.get_by(payload) do
      {:ok, nil} -> {:error, {:unauthorized, "The request is not authorized", [{:username, "not found"}]}}
      {:ok, user} -> {:ok, user}
    end
  end

  defp verify_user(%{password: password} = user, password), do: {:ok, user}

  defp verify_user(_, _), do: {:error, {:unauthorized, "The request is not authorized", [{:password, "no match"}]}}

  defp sign_token_for_user(user) do
    token = %{id: user[:id]}
    |> token
    |> with_signer(hs256(@token_secret))
    |> with_exp(Joken.current_time + @one_hour)
    |> sign
    |> get_compact

    user = user
    |> Map.merge(@empty_pass)
    |> Map.merge(%{token: token})
    {:ok, user}
  end
end
