defmodule Workout.Services.Workout do
  use GenServer

  @exercise_repo Application.get_env(:workout, :exercise_repo)

  alias Workout.Schemas

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

  def list(%{user_id: _} = payload) do
    filtered_payload = Map.take(payload, [:user_id, :limit, :offset])
    filtered_payload = Map.merge(%{limit: 10, offset: 0}, filtered_payload)

    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:list, filtered_payload})
    end)
  end

  def get(%{id: id}) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:get, id})
    end)
  end

  def create(payload) do
    :poolboy.transaction(:workout_pool, fn pid ->
      GenServer.call(pid, {:create, payload})
    end)
  end

  def handle_call({:get, id}, _from, state) do
    workout = case Workout.Repositories.Workout.get(id) do
      {:ok, nil} -> {:error, {:enotfound, "Workout could not be found", []}}
      {:ok, workout} -> {:ok, workout}
    end
    {:reply, workout, state}
  end

  def handle_call({:list, payload}, _from, state) do
    workouts = Workout.Repositories.Workout.list(payload)
    {:reply, workouts, state}
  end

  def handle_call({:create, payload}, _from, state) do #should treat exercise_id as integer on API
    result = payload
    |> cast_to_date(:workout_date)
    |> validate_create
    |> validate_exercise_existence
    |> create_workout

    {:reply, result, state}
  end

  defp cast_to_date(payload, key) do
    case payload[key] do
      nil -> payload
      value ->
        case Timex.parse(value, "{YYYY}-{0D}-{0D}") do
          {:error, _} -> {:error, {:invalid, [{key, "Date not valid"}]}}
          {:ok, date} -> {:ok, Map.put(payload, key, Timex.Ecto.DateTime.cast!(date))}
        end
    end
  end

  defp validate_create({:error, reason}), do: {:error, reason}

  defp validate_create({:ok, payload}) do
    Schemas.Workout.validate_create(payload)
  end

  defp validate_exercise_existence({:error, reason}), do: {:error, reason}

  defp validate_exercise_existence({:ok, payload}) do
    exercise_ids = for %{exercise_id: id} <- payload[:performed_exercises], do: id
    {:ok, exercises} = @exercise_repo.list(%{ids: exercise_ids})

    found_exercise_ids = for %{id: id} <- exercises, do: id

    case Enum.sort(exercise_ids) === Enum.sort(found_exercise_ids) do
      true -> {:ok, payload}
      false -> {:error, {:invalid, [{:exercise_id, "Not found"}]}}
    end
  end

  defp create_workout({:error, reason}), do: {:error, reason}

  defp create_workout({:ok, payload}) do
    Workout.Repositories.Workout.create(payload)
  end
end
