import Metrics from "../models/application/metrics.model.js";
import metricsData from "../data/Metrics.json" with { type: "json" };
import logger from "../utils/logger.util.js";

export const seedMetrics = async (): Promise<void> => {
    const count = await Metrics.count();
    if (count > 0) {
        logger.log(`Metrics already seeded (${count} records). Skipping.`);
        return;
    }

    const data = metricsData.filter((m: any) => m.metricName);
    await Metrics.bulkCreate(data);
    logger.success(`Seeded ${data.length} metrics.`);
};
