defmodule Workout.Services.Exercise do
  use GenServer
  alias Workout.Schemas.Exercise

  @type exercise :: %{id: integer, name: String.t, description: String.t, categories: [String.t]}
  @type create_payload :: %{name: String.t, description: String.t, categories: [String.t], type: String.t}

  @workout_repo Application.get_env(:workout, :workout_repo)

  import Workout.Error, only: [handle_error: 1]

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

  @doc """
    This endpoint will create an exercise in the system

    Valid parameters are:

    - name (String): The name of the exercise\n
    - description (String): The description of the exercise\n
    - categories (String[]): An array of categories\n
    - type (String): The type of exercise. Can be: strength, endurance\n
  """
  @spec create(create_payload) :: {:ok, exercise} | {:error, any}
  def create(payload) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:create, payload})
    end)
  end

  @doc """
    This endpoint will update an exercise in the system

    Valid parameters are:

    - id (Integer): The id of the exercise (required)
    - description (String): The description of the exercise
    - categories (String[]): The categories of the exercise (replaces all old categories!)
  """

  def update(%{id: id} = payload) when is_integer(id) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:update, payload})
    end)
  end

  @spec delete(%{id: integer}) :: {:ok, integer}
  def delete(%{id: id}) do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, {:delete, id})
    end)
  end

  @doc """
    This endpoint returns the amount of Workout known in the system

    ## Example

      iex> Workout.Services.Exercise.count
      {:ok, 1}
  """
  @spec count() :: {:ok, integer}
  def count do
    :poolboy.transaction(:exercise_pool, fn pid ->
      GenServer.call(pid, :count)
    end)
  end

  def handle_call({:get, id}, _from, state) do
    result = find_exercise(id)
    {:reply, result, state}
  end

  def handle_call({:list, filters}, _from, state) do
    exercises = Workout.Repositories.Exercise.list(filters)
    {:reply, exercises, state}
  end

  def handle_call({:update, payload}, _from, state) do
    with {:ok, exercise} <- find_exercise(payload[:id]) do
      result = Exercise.update_changeset(exercise, payload)
      |> Workout.Repositories.Exercise.update

      {:reply, result, state}
    else
      err -> {:reply, err, state}
    end
  end

  def handle_call({:delete, id}, _from, state) do
    result = with {:ok, 0} <- @workout_repo.count(%{exercise_id: [id]}),
                  {:ok, exercise} <- find_exercise(id)
    do
      {:ok, %{id: deleted_id}} = Exercise.delete_changeset(exercise)
      |> Workout.Repositories.Exercise.delete
      {:ok, deleted_id}
    else
      error -> handle_error(error)
    end
    {:reply, result, state}
  end

  def handle_call({:create, payload}, _from, state) do
    result = Exercise.create_changeset(payload)
    |> Workout.Repositories.Exercise.create

    {:reply, result, state}
  end

  def handle_call(:count, _from, state) do
    {:reply, Workout.Repositories.Exercise.count, state}
  end

  defp find_exercise(id) do
    case Workout.Repositories.Exercise.get(id) do
      {:ok, nil} -> handle_error(:enotfound)
      {:ok, exercise} -> {:ok, exercise}
    end
  end
end
