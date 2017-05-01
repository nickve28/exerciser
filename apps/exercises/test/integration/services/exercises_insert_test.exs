defmodule Exercises.InsertTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  doctest Exercises
  alias Exercises.Schemas
  alias Exercises.Services
  alias Exercises.Repo
  alias Exercises.RepoHelper

  @tag :create
  test "#insert should fail if no name is given" do
    payload = %{description: "foo", categories: ["bar"], type: "strength"}

    assert {:error, {:invalid, "The request was deemed invalid.", [name: :required]}}=== Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no description is given" do
    payload = %{name: "foo", categories: ["bar"], type: "strength"}

    assert {:error, {:invalid, "The request was deemed invalid.", [description: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no categories are given" do
    payload = %{name: "foo", description: "bar", type: "strength"}

    assert {:error, {:invalid, "The request was deemed invalid.", [categories: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if no type is given" do
    payload = %{name: "foo", description: "bar", categories: ["a"]}

    assert {:error, {:invalid, "The request was deemed invalid.", [type: :required]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should fail if invalid type is given" do
    payload = %{name: "foo", description: "bar", categories: ["a"], type: "gamma"}

    assert {:error, {:invalid, "The request was deemed invalid.", [type: :invalid_value]}} === Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should save the exercise" do
    payload = %{name: "foo", categories: ["bar"], description: "baz", type: "strength"}

    assert {:ok, %{id: _}} = Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should normalize the categories" do
    payload = %{name: "foo", categories: ["bar"], description: "baz", type: "strength"}
    expected = ["Bar"]

    assert {:ok, %{categories: ^expected}} = Services.Exercise.create(payload)
  end

  @tag :create
  test "#insert should normalize the name" do
    payload = %{name: "foo", categories: ["bar"], description: "baz", type: "strength"}
    expected = "Foo"

    assert {:ok, %{name: ^expected}} = Services.Exercise.create(payload)
  end
end