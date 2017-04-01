defmodule Progress.Repositories.Workout do
  @moduledoc """
    A repository for fetching workout data
  """

  alias Progress.Repositories.PaginateCall

  @limit 10
  @offset 0

  @doc """
    Fetches a list of workouts matching the filter. Pagination is done internally.
  """
  def list(payload) do
    paginated_fn = fn limit, offset -> list_all(payload, limit, offset) end
    {:ok, PaginateCall.call(paginated_fn, {@limit, @offset})}
  end

  defp list_all(payload, limit, offset) do
    list_payload = Map.merge(payload, %{limit: limit, offset: offset})
    case Workout.Services.Workout.list(list_payload) do
      {:ok, workouts} -> workouts
      _ -> :error
    end
  end
end