defmodule Api.Resolvers.ProgressResolver do
  @moduledoc false
  def get(payload, %{context: %{user_id: user_id}}) do
    user_context_payload = payload
    |> Map.put(:user_id, user_id)

    Progress.Services.Progress.get(user_context_payload)
    |> handle_result
  end

  defp handle_result({:ok, result}), do: {:ok, result}

  defp handle_result({:error, {:enotfound, message, _}}), do: {:error, %{message: message, code: 404, details: []}}

  defp handle_result({:error, {:invalid, _, details}}) do
    detail_map = Enum.into(details, %{})
    {:error, %{message: "The request was deemed invalid. Refer to the error details", code: 400, details: detail_map}}
  end

  defp handle_result(err) do
    {:error, %{message: "Something went wrong", code: 500, details: []}}
  end
end