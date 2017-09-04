defmodule Workout.Mixfile do
  use Mix.Project

  def project do
    [app: :workout,
     version: "0.1.0",
     build_path: "../../_build",
     config_path: "../../config/config.exs",
     deps_path: "../../deps",
     lockfile: "../../mix.lock",
     elixir: "~> 1.3",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps]
  end

  # Configuration for the OTP application
  #
  # Type "mix help compile.app" for more information
  def application do
    [applications: [:logger, :postgrex, :ecto, :poolboy, :timex, :timex_ecto, :vex],
     mod: {Workout, []}]
  end

  # Dependencies can be Hex packages:
  #
  #   {:mydep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:mydep, git: "https://github.com/elixir-lang/mydep.git", tag: "0.1.0"}
  #
  # To depend on another app inside the umbrella:
  #
  #   {:myapp, in_umbrella: true}
  #
  # Type "mix help deps" for more examples and options
  defp deps do
    [
      {:postgrex, ">= 0.13.0"},
      {:ecto, "~> 2.1.0"},
      {:poolboy, "~> 1.5"},
      {:timex, "3.1.24"},
      {:timex_ecto, "3.1.1"},
      {:vex, "~> 0.6.0"}
    ]
  end
end
