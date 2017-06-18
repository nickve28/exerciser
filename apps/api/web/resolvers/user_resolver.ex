defmodule Api.Resolvers.UserResolver do
  @moduledoc false
  def login(%{username: name, password: password}, _info) do
    User.Services.User.authenticate(%{name: name, password: password})
    |> handle_result
    |> IO.inspect
  end

  def login(_, _) do
    {:error, "Please provide name and password"}
  end

  def get(_args, %{context: %{user_id: user_id}}) do
    User.Services.User.get(user_id)
    |> handle_result
  end

  defp handle_result({:ok, result}), do: {:ok, result}

  defp handle_result({:error, {:enotfound, message, _}}), do: {:error, %{message: message, code: 404, details: []}}

  defp handle_result({:error, {:invalid, _, details}}) do
    detail_map = Enum.into(details, %{})
    {:error, %{message: "The request was deemed invalid. Refer to the error details", code: 400, details: detail_map}}
  end

  defp handle_result({:error, {:unauthorized, _, details}}) do
    detail_map = Enum.into(details, %{})
    {:error, %{message: "Authentication failed", code: 401, details: detail_map}}
  end

  defp handle_result(_) do
    {:error, %{message: "Something went wrong", code: 500, details: []}}
  end
end

