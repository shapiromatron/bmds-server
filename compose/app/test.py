import bmds
from bmds.bmds3.models.dichotomous import Logistic

dataset = bmds.DichotomousDataset(
    doses=[0, 50, 100, 150, 200], ns=[100, 100, 100, 100, 100], incidences=[0, 5, 30, 65, 90]
)
model = Logistic(dataset=dataset)
result = model.execute()
print(result.dict())  # noqa: T201
