defmodule Progress.Error do
  @doc """
    A simple module with error handlers, coercing errors to service output
  """

  def handle_error({:error, {:enotfound, message, []}}) do
    {:error, {:unprocessable, "The request could not be processed.", [{:user_id, message}]}}
  end

  def handle_error({:error, details}) do
    {:error, {:invalid, "The request was deemed invalid.", details}}
  end

  def handle_error(_) do
    {:error, {:internal, "Internal Server Error", []}}
  end
end