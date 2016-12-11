defmodule Api.Resolvers.UserResolver do
  def authenticate(%{name: name, password: password}, _info) do
    IO.puts name

  end

  def authenticate(_, _) do
    IO.puts "Error"
    {:error}
  end
end

