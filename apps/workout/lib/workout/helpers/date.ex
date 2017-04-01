defmodule Workout.Helpers.Date do
  @moduledoc """
    This module contains helpers for date related conversions.
  """

  @date_format "{YYYY}-{0M}-{0D}"

  @doc """
    Converts a YYYY-MM-DD value in a map to a timex object. If the key does no exist, nothing is done.

    iex> Date.to_date(%{date: "2017-01-01"}, :date)
    %{date: ~N[2017-01-01 00:00:00]}
  """
  def to_date(payload, key) do
    if payload[key] do
      Map.put(payload, key, Timex.parse!(payload[key], @date_format))
    else
      payload
    end
  end
end
