defmodule Api.LoginView do
  @moduledoc false
  use Api.Web, :view

  def render("authenticate.json", %{data: {:error, error}}) do
    %{
      error: error
    }
  end

  def render("authenticate.json", %{data: user}) do
    user
  end
end
