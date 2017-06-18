defmodule Api.Plugs.Authentication do
  @moduledoc false
  #alias User.Services.User TODO: verify in repo
  import Joken

  @token_secret Application.get_env(:api, :token_secret)

  @behaviour Plug

  @bad_request 400
  @unauthenticated 401

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    case is_authenticated(conn) do
      {:ok, context} ->
        IO.inspect(context)
        put_private(conn, :absinthe, %{context: context})
      _ ->
        conn
        |> put_private(:absinthe, %{context: %{authenticated: false}})
    end
  end

  defp is_authenticated(conn) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
    {:ok, %{id: id}} <- authorize(token) do
      {:ok, %{user_id: id}}
    else
      _ -> {:error, "Token was deemed invalid or not present"}
    end
  end

  defp authorize(token) do
    token_data = token
    |> token
    |> with_signer(hs256(@token_secret))
    |> with_validation("exp", &(&1 > current_time))
    |> verify
    |> get_claims

    case token_data do
      %{"id" => id} -> {:ok, %{id: id}}
      _ -> {:error, "Invalid token"}
    end
  end
end

