defmodule Api.AuthenticationTest do
  use Api.ConnCase

  test "/api/graphql should return unauthorized if no token is present", %{conn: conn} do
    assert %{status: 401} = post(conn, "/api/graphql", query: "{me { name, id } }")
  end

  test "/api/graphql should return unauthorized if the given token is expired", %{conn: conn} do
    expired_token = TokenHelper.create_token(%{"id" => 1}, Joken.current_time - 1)

    conn = conn
    |> put_req_header("authorization", "Bearer #{expired_token}")

    assert %{status: 401} = post(conn, "/api/graphql", query: "{me { name, id } }")
  end

  test "/api/graphql should return success and the response if the token is present and valid", %{conn: conn} do
    token = TokenHelper.create_token(%{"id" => 1}, Joken.current_time + 3600)

    conn = conn
    |> put_req_header("authorization", "Bearer #{token}")

    assert %{status: 200} = post(conn, "/api/graphql", query: "{me { name, id } }")
  end
end
