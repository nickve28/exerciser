defmodule Workout.Services.Workout do
  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  def list(%{user_id: user_id} = payload) do
    filtered_payload = Map.take(payload, [:user_id, :limit, :offset])
    filtered_payload = Map.merge(%{limit: 10, offset: 0}, filtered_payload)

    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:list, filtered_payload})
    end)
  end

  def handle_call({:list, payload}, _from, state) do
    workouts = Workout.Repositories.Workout.list(payload)
    {:reply, workouts, state}
  end
end
