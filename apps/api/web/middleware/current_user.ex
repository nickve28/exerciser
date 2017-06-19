defmodule Api.Web.Middleware.CurrentUser do
  @behaviour Absinthe.Middleware

  @unauthorized %{
    code: 401,
    message: "Request not authorized",
    details: []
  }

  def call(resolution, _config) do
    context = resolution.context
    case context do
      %{user_id: id} ->
        resolution
      _ ->
        resolution
        |> Absinthe.Resolution.put_result({:error, @unauthorized})
    end
  end
end
