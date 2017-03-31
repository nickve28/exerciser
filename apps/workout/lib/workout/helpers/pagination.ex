defmodule Workout.Helpers.Pagination do
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