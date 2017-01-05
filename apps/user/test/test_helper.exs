ExUnit.start()

defmodule User.RepoHelper do
  alias User.Schemas
  alias User.Repo

  @salt Application.get_env(:user, :salt)

  def to_model(%Schemas.User{} = user) do
    User.Repositories.User.to_model(user)
  end

  def create_user(name, password) do
    {:ok, hashed_pw} = :bcrypt.hashpw(password, @salt)
    hashed_pw = to_string(hashed_pw)
    user = %Schemas.User{
      name: name,
      password: hashed_pw,
    }

    {:ok, user} = Repo.insert!(user)
    |> to_model

    user
  end
end