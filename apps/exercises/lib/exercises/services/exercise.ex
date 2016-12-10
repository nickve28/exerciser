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

  def handle_call({:get, id}, _from, state) do
    exercise = Exercises.Repositories.Exercise.get(id)
    {:reply, exercise, state}
  end
end
