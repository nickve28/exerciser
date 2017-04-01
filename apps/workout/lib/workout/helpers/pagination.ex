defmodule Workout.Helpers.Pagination do
  @moduledoc """
    Convenience function to add pagination to requests.
    Incorrect values get coerced to the nearest boundary.

    iex> Pagination.set_pagination(%{})
    %{limit: 10, offset: 0}

    iex> Pagination.set_pagination(%{limit: 11})
    %{limit: 10, offset: 0}
  """
  def set_pagination(payload) do
    limit = case payload[:limit] do
      limit when limit > 10 or limit < 0 -> 10
      nil -> 10
      limit -> limit
    end

    offset = payload[:offset] || 0
    %{limit: limit, offset: offset}
  end
end