defmodule Api.PageController do
  use Api.Web, :controller

  def index(conn, _) do
    render conn, %{}
  end
end
