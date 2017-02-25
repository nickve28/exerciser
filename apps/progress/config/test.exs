use Mix.Config

config :progress, user_repo: Progress.Repositories.Mocks.User
config :progress, workout_repo: Progress.Repositories.Mocks.Workout
config :progress, exercise_repo: Progress.Repositories.Mocks.Exercise