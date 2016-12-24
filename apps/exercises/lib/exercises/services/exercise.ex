defmodule Exercises.Services.Exercise do
  use GenServer
  alias Exercises.Schemas.Exercise

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

  def create(payload) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:create, payload})
    end)
  end

  def delete(%{id: id}) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:delete, id})
    end)
  end

  def handle_call({:get, id}, _from, state) do
    result = case Exercises.Repositories.Exercise.get(id) do
      nil -> {:error, :enotfound}
      exercise -> {:ok, exercise}
    end

    {:reply, result, state}
  end

  def handle_call({:list, filters}, _from, state) do
    exercises = Exercises.Repositories.Exercise.list(filters)
    {:reply, {:ok, exercises}, state}
  end

  def handle_call({:delete, id}, _from, state) do
    result = case Exercises.Repositories.Exercise.delete(id) do
      {count, _} when count === 1 -> {:ok, id}
      {count, _} when count === 0 -> {:error, :enotfound}
      _ -> {:error, :internal}
    end
    {:reply, result, state}
  end

  def handle_call({:create, payload}, _from, state) do
    result = payload
    |> Exercise.validate_payload
    |> normalize
    |> create_exercise

    {:reply, result, state}
  end

  defp normalize({:error, errors}), do: {:error, errors}

  defp normalize({:ok, payload}) do
    {:ok, %{payload | name: String.capitalize(payload[:name]),
                      categories: Enum.map(payload[:categories], &String.capitalize/1)}}
  end

  defp create_exercise({:error, errors}), do: {:error, errors}

  defp create_exercise({:ok, payload}) do
    case Exercises.Repositories.Exercise.create(payload) do
      {:error, reason} -> {:error, reason}
      {:ok, exercise} -> {:ok, exercise}
    end
  end
end
