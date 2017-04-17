defmodule Exercises.Error do
  def handle_error(:enotfound) do
    {:error, {:enotfound, "Exercise not found", []}}
  end

  def handle_error(error) do
    {:invalid, "The request was deemed invalid.", to_errors(error)}
  end

  defp to_errors(errors) do
    for {prop, {value, _}} <- errors do
      val = case value do
        "can't be blank" -> :required
        "invalid_value" -> :invalid_value
        _ -> value
      end
      {prop, val}
    end
  end
end