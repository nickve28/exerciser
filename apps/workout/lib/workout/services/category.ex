defmodule Workout.Services.Category do
  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  @doc """
    This endpoint lists all categories assigned to exercises in a single list.
  """
  @spec list :: [String.t] | []
  def list do
    :poolboy.transaction(:category_pool, fn pid ->
      GenServer.call(pid, {:list})
    end)
  end

  def handle_call({:list}, _from, state) do
    result = case Workout.Repositories.Exercise.list_categories do
      data when is_list(data) -> {:ok, data}
      _ -> {:error, "something went wrong"}
    end
    {:reply, result, state}
  end
end
