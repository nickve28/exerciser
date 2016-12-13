defmodule Exercises.Services.Exercise do
  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  def get(id) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
  end

  def list(payload \\ %{}) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:list, payload})
    end)
  end

  def handle_call({:get, id}, _from, state) do
    exercise = Exercises.Repositories.Exercise.get(id)
    {:reply, {:ok, exercise}, state}
  end

  def handle_call({:list, filters}, _from, state) do
    exercises = Exercises.Repositories.Exercise.list(filters)
    {:reply, {:ok, exercises}, state}
  end
end
