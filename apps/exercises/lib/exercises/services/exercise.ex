defmodule Exercises.Services.Exercise do
  use GenServer
  alias Exercises.Schemas.Exercise

  @type exercise :: %{id: integer, name: String.t, description: String.t, categories: [String.t]}
  @type create_payload :: %{name: String.t, description: String.t, categories: [String.t]}

  @workout_repo Application.get_env(:exercises, :workout_repo)

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  @spec get(integer) :: {:ok, exercise} | {:error, :enotfound}
  def get(id) when is_number(id) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
  end

  @spec list(Map.t) :: {:ok, [exercise]} | {:ok, []}
  def list(payload \\ %{}) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:list, payload})
    end)
  end

  @spec create(create_payload) :: {:ok, exercise} | {:error, any}
  def create(payload) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:create, payload})
    end)
  end

  @spec delete(%{id: integer}) :: {:ok, integer}
  def delete(%{id: id}) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:delete, id})
    end)
  end

  @doc """
    This endpoint returns the amount of exercises known in the system

    ## Example

      iex> Exercises.Services.Exercise.count
      {:ok, 0}
  """
  @spec count() :: {:ok, integer}
  def count do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, :count)
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
    result = with {:ok, 0} <- @workout_repo.count(%{exercise_id: [id]}),
                  {1, _} <- Exercises.Repositories.Exercise.delete(id)
    do
      {:ok, id}
    else
      error -> case error do
        {0, _} -> {:error, {:enotfound, "Exercise not found", []}}
        {:ok, count} when count > 0 -> {:error, {:unprocessable, "The request could not be processed.", [{:id, "is used in a workout"}]}}
        _ -> error
      end
    end
    {:reply, result, state}
  end

  def handle_call({:create, payload}, _from, state) do
    result = case Exercise.create_changeset(payload) do
      {:ok, changeset} -> Exercises.Repositories.Exercise.create(changeset)
      {:error, error} -> {:error, error}
    end

    {:reply, result, state}
  end

  def handle_call(:count, _from, state) do
    {:reply, Exercises.Repositories.Exercise.count, state}
  end
end
