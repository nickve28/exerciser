defmodule Api.PageController do
  @moduledoc false
  use Api.Web, :controller

  def index(conn, _) do
    render conn, %{}
  end
end
