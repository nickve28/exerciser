defmodule Workout.Helpers.ValidatorTest do
  use ExUnit.Case
  alias Workout.Helpers.Validator

  test "validate_list should fail if specified from date is invalid" do
    result = Validator.validate_list(%{user_id: 1, limit: 10, offset: 0, from: "2017-2017-2017"})
    assert {:error, [{:from, "Invalid date, expected YYYY-MM-DD format"}]} === result
  end

  test "validate_list should succeed if from date is not specified" do
    result = Validator.validate_list(%{user_id: 1, limit: 10, offset: 0})
    assert :ok === result
  end

  test "validate_list should fail if specified until date is invalid" do
    result = Validator.validate_list(%{user_id: 1, limit: 10, offset: 0, until: "2017-2017-2017"})
    assert {:error, [{:until, "Invalid date, expected YYYY-MM-DD format"}]} === result
  end

  test "validate_list should succeed if until date is not specified" do
    result = Validator.validate_list(%{user_id: 1, limit: 10, offset: 0})
    assert :ok === result
  end

  test "validate_list should fail if no user_id is given" do
    result = Validator.validate_list(%{limit: 10, offset: 0})
    assert {:error, [{:user_id, "must be present"}]} === result
  end
end