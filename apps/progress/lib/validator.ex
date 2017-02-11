defmodule Progress.Validator do
  @list_validations [
    user_id: [presence: true],
    exercise_id: [presence: true],
    from: &Workout.Helpers.Validator.validate_date/1,
    until: &Workout.Helpers.Validator.validate_date/1
  ]

  def validate(:get, payload) do
    case Vex.errors(payload, @list_validations) do
      [] -> :ok
      err -> {:error, to_external_error(err)}
    end
  end

  def validate_date(nil), do: :ok

  def validate_date(date) do
    case Timex.parse(date, @date_format) do
      {:ok, _} -> :ok
      _ -> {:error, "Invalid date, expected YYYY-MM-DD format"}
    end
  end


  defp to_external_error(errors) when is_list(errors) do
    for error <- errors, do: to_external_error(error)
  end

  defp to_external_error({:error, property, _, message}) do
    {property, message}
  end
end