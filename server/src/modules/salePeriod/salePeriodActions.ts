import salePeriodRepository from "./salePeriodRepository";

const getActiveSalePeriodAction = () => salePeriodRepository.findActive();

export default { getActiveSalePeriodAction };
