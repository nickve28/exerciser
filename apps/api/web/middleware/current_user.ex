defmodule Api.Web.Middleware.CurrentUser do
  @behaviour Absinthe.Middleware

  def call(resolution, _config) do
    context = resolution.context
    IO.inspect(context)
    case context do
      %{user_id: id} ->
        resolution
      _ ->
        resolution
        |> Absinthe.Resolution.put_result({:error, "unauthenticated"})
    end
  end
end
