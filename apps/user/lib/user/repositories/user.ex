defmodule User.Repositories.User do
  @moduledoc false
  alias User.Repo
  alias User.Schemas.User

  @skeleton %{
    name: nil,
    id: nil,
    password: nil
  }

  def to_model(nil), do: nil

  def to_model({:ok, user}), do: to_model(user)

  def to_model(user) do
    @skeleton
    |> Map.merge(user)
    |> Map.take([:name, :id, :password])
  end

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
