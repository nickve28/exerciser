defmodule Progress.Validator do
  @list_validations [
    user_id: [presence: true],
    exercise_id: [presence: true]
  ]

  def validate(:get, payload) do
    case Vex.errors(payload, @list_validations) do
      [] -> :ok
      err -> {:error, to_external_error(err)}
    end
  end

  defp to_external_error(errors) when is_list(errors) do
    for error <- errors, do: to_external_error(error)
  end

  defp to_external_error({:error, property, _, message}) do
    {property, message}
  end
end