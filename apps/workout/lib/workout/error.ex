defmodule Workout.Error do
  @moduledoc """
    Convenience error handlers for service endpoints
  """

  def handle_error(:list, error) do
    case error do
      {:error, error} when is_list(error) ->
        {:invalid, "The request did not meet the minimal required parameters", error}
      _ ->
        {:internal, "Internal Server error", []}
    end
  end

  def handle_error(:update, error) do
    case error do
      {:error, error} -> {:error, error}
        _ -> {:error, :internal}
    end
  end

  def handle_error(:create, error) do
    case error do
      {:error, {:invalid, message, details}} -> {:error, {:invalid, message, details}}
        _ -> {:error, :internal}
    end
  end

  def handle_error(_, _) do #catch all unknown errors
    {:error, {:internal, "Internal Server error", []}}
  end
end