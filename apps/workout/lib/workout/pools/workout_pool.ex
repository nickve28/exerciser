defmodule Workout.Pools.Workout do
  use Supervisor

  @pool_name :workout_pool

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    pool_options = [
      name: {:local, @pool_name},
      worker_module: Workout.Services.Workout,
      size: 10,
      max_overflow: 10
    ]

    children = [
      :poolboy.child_spec(@pool_name, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end