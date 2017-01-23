defmodule User.Services.UserTest do
  use ExUnit.Case

  alias User.Services
  alias User.Schemas
  alias User.Repo

  setup do
    Repo.delete_all(Schemas.User)
    :ok
  end

  test "when the user exists #get should return the user" do
    %{id: id} = created_user = User.RepoHelper.create_user("Nick", "foo")

    assert {:ok, Map.merge(created_user, %{password: nil})} === Services.User.get(id)
  end

  test "when the user does not exist #get should return an error" do
    %{id: id} = User.RepoHelper.create_user("Nick", "foo")

    assert {:error, {:enotfound, "The user could not be found", []}} = Services.User.get(id + 1)
  end

  test "#create should create the new user" do
    payload = %{name: "Nick", password: "Foo"}

    assert {:ok, %{id: _, name: "Nick", password: nil}} = Services.User.create(payload)
  end

  describe "#authenticate" do
    setup do
      user = User.RepoHelper.create_user("Nick", "foo")
      {:ok, user: user}
    end

    test "should return unauthorized if the passwords dont match" do
      payload = %{name: "Nick", password: "Foo"}
      details = [
        {:password, "no match"}
      ]

      assert {:error, {:unauthorized, "The request is not authorized", details}} === Services.User.authenticate(payload)
    end

    test "should return unauthorized if the username does not exist" do
      payload = %{name: "nick", password: "foo"}
      details = [
        {:username, "not found"}
      ]

      assert {:error, {:unauthorized, "The request is not authorized", details}} === Services.User.authenticate(payload)
    end
  end
end