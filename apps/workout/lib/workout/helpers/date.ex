defmodule Workout.Helpers.Date do
  @date_format "{YYYY}-{0M}-{0D}"

  def to_date(payload, key) do
    if payload[key] do
      Map.put(payload, key, Timex.parse!(payload[key], @date_format))
    else
      payload
    end
  end
end
