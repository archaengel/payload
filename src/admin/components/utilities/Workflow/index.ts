import { post, pre } from '../../../../workflows/baseFields';

export interface Stage {
  stage: {
    name: string;
    approver: string;
  }
}

export function getNextStage(stages: Stage[], currentStage: string): string | null {
  if (stages.length === 0) {
    return null;
  }

  if (currentStage === pre) {
    return stages[0].stage.name;
  }

  const currentStageIndex = stages.findIndex(({ stage }) => stage.name === currentStage);
  const lastIndex = stages.length - 1;

  if (currentStageIndex !== -1 && currentStageIndex !== lastIndex) {
    return stages[currentStageIndex + 1].stage.name;
  }

  return post;
}
