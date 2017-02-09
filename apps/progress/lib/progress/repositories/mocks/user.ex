defmodule Progress.Repositories.Mocks.User do
  @stub_user %{
    id: 1,
    name: "Nick"
  }

  def get(1) do
    {:ok, @stub_user}
  end

  def get(_) do
    {:error, {:enotfound, "The user could not be found", []}}
  end
end