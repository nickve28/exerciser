defmodule Progress.Services.Progress do
  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, [], [])
  end

  def init(state), do: {:ok, state}

end
