ExUnit.start

defmodule TokenHelper do
  import Joken

  @token_secret Application.get_env(:api, :token_secret)

  def create_token(payload, expiry_time) when is_integer(expiry_time) do
    payload
    |> token
    |> with_signer(hs256(@token_secret))
    |> with_exp(expiry_time)
    |> sign
    |> get_compact
  end
end