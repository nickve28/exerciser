defmodule Workout.Repositories.MockWorkout do
  use GenServer

  def init(_) do
    {:ok, 0}
  end

  def set_count_response(response) do
    if (!Process.whereis(__MODULE__)) do
      GenServer.start(__MODULE__, [], name: __MODULE__)
    end
    GenServer.call(__MODULE__, {:set_count_response, response})
  end

  def count(%{exercise_id: _}) do
    if (!Process.whereis(__MODULE__)) do
      GenServer.start(__MODULE__, [], name: __MODULE__)
    end

    GenServer.call(__MODULE__, :count)
  end

  def handle_call(:count, _from, count) do
    {:reply, {:ok, count}, count}
  end

  def handle_call({:set_count_response, response}, _from, _) do
    {:reply, :ok, response}
  end

  def stop do
    GenServer.stop(__MODULE__)
  end
end