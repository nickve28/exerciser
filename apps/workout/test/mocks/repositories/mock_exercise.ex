defmodule Workout.Repositories.MockExercise do
  @moduledoc false

  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_), do: {:ok, :disabled}

  def enable do
    GenServer.call(__MODULE__, :enable)
  end

  def disable do
    GenServer.call(__MODULE__, :disable)
  end

  def list(payload) do
    GenServer.call(__MODULE__, {:list, payload})
  end

  def get(payload) do
    GenServer.call(__MODULE__, {:get, payload})
  end

  def create(payload) do
    GenServer.call(__MODULE__, {:create, payload})
  end

  def update(payload) do
    GenServer.call(__MODULE__, {:update, payload})
  end

  def delete(payload) do
    GenServer.call(__MODULE__, {:delete, payload})
  end

  def handle_call(:enable, _from, _) do
    {:reply, :enabled, :enabled}
  end

  def handle_call(:disable, _from, _) do
    {:reply, :disabled, :disabled}
  end

  def handle_call({:list, %{ids: [0]}}, _from, :enabled) do
    {:reply, {:ok, []}, :enabled}
  end

  def handle_call({:list, %{ids: [1]}}, _from, :enabled) do
    {
      :reply,
      {:ok, [%{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"], type: "strength"}]},
      :enabled
    }
  end

  def handle_call({:list, %{ids: [1, 2]}}, _from, :enabled) do
    {
      :reply,
      {:ok, [
        %{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"], type: "strength"},
        %{id: 2, name: "Threadmill", description: "something", categories: ["Fitness"], type: "endurance"}
      ]},
      :enabled
    }
  end

  def handle_call({:list, %{ids: [id]}}, _from, :enabled) when is_number(id) do
    {
      :reply,
      {:ok, [%{id: id, name: "Squats", description: "something", categories: ["Back"], type: "strength"}]},
      :enabled
    }
  end

  #if disabled, use regular implementation
  def handle_call({operation, payload}, _from, :disabled) do
    {:reply, apply(Workout.Repositories.Exercise, operation, [payload]), :disabled}
  end
end