defmodule User.Services.User do
  use GenServer
  import Joken

  @salt Application.get_env(:user, :salt)
  @token_secret Application.get_env(:user, :token_secret)
  @empty_pass %{password: nil}

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  def authenticate(%{name: username, password: password}) do
    user = :poolboy.transaction(:user_pool, fn pid ->
      GenServer.call(pid, {:get_by, %{name: username}})
    end)

    {:ok, hashed_pw} = :bcrypt.hashpw(password, @salt)
    hashed_pw = to_string(hashed_pw)

    verify_user(user, hashed_pw)
    |> to_output
  end

  defp to_output({:error, _} = error), do: error

  defp to_output({:ok, user}) do
    token = %{id: user[:id]}
    |> token
    |> with_signer(hs256(@token_secret))
    |> sign
    |> get_compact

    user = user
    |> Map.merge(@empty_pass)
    |> Map.merge(%{token: token})
    {:ok, user}
  end

  defp verify_user(%{password: password} = user, password), do: {:ok, user}

  defp verify_user(_, _), do: {:error, :password_no_match}

  def get(id) do
    user = :poolboy.transaction(:user_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
    Map.merge(user, @empty_pass)
  end

  def create(%{name: name, password: password}) do
    :poolboy.transaction(:user_pool, fn pid ->
      GenServer.call(pid, {:create, %{name: name, password: password}})
    end)
  end

  def handle_call({:get_by, payload}, _from, state) do
    user = User.Repositories.User.get_by(payload)
    {:reply, user, state}
  end

  def handle_call({:get, id}, _from, state) do
    user = User.Repositories.User.get(id)
    {:reply, user, state}
  end

  def handle_call({:create, %{name: name, password: password}}, _from, state) do
    {:ok, hashed_pw} = :bcrypt.hashpw(password, @salt)
    hashed_pw = to_string(hashed_pw)
    new_user_payload = %{
      name: name,
      password: hashed_pw
    }
    user = User.Repositories.User.create(new_user_payload)
    {:reply, user, state}
  end
end
