defmodule Progress.Pools.Progress do
  @moduledoc false
  use Supervisor

  @pool_name :progress_pool

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    pool_options = [
      name: {:local, @pool_name},
      worker_module: Progress.Services.Progress,
      size: 5,
      max_overflow: 5
    ]

    children = [
      :poolboy.child_spec(@pool_name, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end