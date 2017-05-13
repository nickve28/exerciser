defmodule Workout.Repositories.MockWorkout do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    {:ok, {:disabled, %{}}}
  end

  def enable do
    GenServer.call(__MODULE__, :enable)
  end

  def disable do
    GenServer.call(__MODULE__, :disable)
  end

  def stub(operation, response) when is_atom(operation) do
    GenServer.call(__MODULE__, {:stub, operation, response})
  end

  def list(payload) do
    GenServer.call(__MODULE__, {:list, payload})
  end

  def count(payload) do
    GenServer.call(__MODULE__, {:count, payload})
  end

  def handle_call(:enable, _from, {_, stubs}) do
    {:reply, :enabled, {:enabled, stubs}}
  end

  def handle_call(:disable, _from, {_, stubs}) do
    {:reply, :disabled, {:disabled, stubs}}
  end

  def handle_call({:stub, operation, response}, _from, {active_state, responses}) do
    new_response_set = Map.merge(responses, %{operation => response})
    {:reply, response, {active_state, new_response_set}}
  end

  def handle_call({:list, _payload}, _from, {:enabled, %{list: list_response} = state}) do
    {:reply, list_response, {:enabled, state}}
  end

  def handle_call({:count, _payload}, _from, {:enabled, %{count: count_response} = state}) do
    {:reply, count_response, {:enabled, state}}
  end

  #in case disabled, delegate to actual repo
  def handle_call({operation, payload}, _from, {:disabled, _} = state) do
    {:reply, apply(Workout.Repositories.Workout, operation, [payload]), state}
  end

  # def set_count_response(response) do
  #   if (!Process.whereis(__MODULE__)) do
  #     GenServer.start(__MODULE__, [], name: __MODULE__)
  #   end
  #   GenServer.call(__MODULE__, {:set_count_response, response})
  # end

  # def count(%{exercise_id: _}) do
  #   if (!Process.whereis(__MODULE__)) do
  #     GenServer.start(__MODULE__, [], name: __MODULE__)
  #   end

  #   GenServer.call(__MODULE__, :count)
  # end

  # def handle_call(:count, _from, count) do
  #   {:reply, {:ok, count}, count}
  # end

  # def handle_call({:set_count_response, response}, _from, _) do
  #   {:reply, :ok, response}
  # end

  def stop do
    GenServer.stop(__MODULE__)
  end
end