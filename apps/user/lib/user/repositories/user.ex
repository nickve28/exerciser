defmodule User.Repositories.User do
  @moduledoc false
  import User.Models.User, only: [to_model: 1]

  alias User.Repo
  alias User.Schemas.User

  def get(id) do
    Repo.get(User, id)
    |> to_model
  end

  def get_by(payload) do
    Repo.get_by(User, payload)
    |> to_model
  end

  def create(%{name: name, password: password}) do
    user = %User{name: name, password: password}
    Repo.insert(user)
    |> to_model
  end
end
