defmodule Progress.Repositories.PaginateCall do
  @doc """
  This function executes the given function, filling in the 2 parameters in the limit/offset tuple
  Expected is a 2 arg function

  It will stop calling once the list is not equal to the specified limit

  iex> PaginateCall.call(fn limit, offset -> Enum.to_list(1..20) |> Enum.drop(offset) |> Enum.take(limit) end, {10, 0})
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  iex> PaginateCall.call(fn limit, offset -> Enum.to_list(1..5) |> Enum.drop(offset) |> Enum.take(limit) end, {10, 0})
  [1, 2, 3, 4, 5]
  """
  def call(f, {limit, offset}) do
    result = f.(limit, offset)
    result_size = Enum.count(result)
    if (limit > result_size) do
      result
    else
      result ++ call(f, {limit, offset + limit})
    end
  end
end