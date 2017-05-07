defmodule Workout.Pools.Exercise do
  @moduledoc false
  use Supervisor

  @pool_name :exercise_pool

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: Workout.Pools.Exercise)
  end

  def init([]) do
    pool_options = [
      name: {:local, @pool_name},
      worker_module: Workout.Services.Exercise,
      size: 5,
      max_overflow: 10
    ]

    children = [
      :poolboy.child_spec(@pool_name, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end