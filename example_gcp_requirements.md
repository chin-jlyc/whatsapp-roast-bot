# GCP Instance Requirements for WhatsApp Roast Bot

This document outlines the recommended Google Cloud Platform (GCP) instance specifications for running the WhatsApp Roast Bot.

## Resource Requirements Analysis

The WhatsApp Roast Bot has the following resource requirements:

1. **CPU Usage**:

   - Node.js runtime: Low to moderate CPU usage
   - Puppeteer/Chromium (for WhatsApp Web): Moderate CPU usage during initialization
   - Gemini API calls: Minimal CPU usage (mostly network I/O)

2. **Memory Requirements**:

   - Node.js runtime: ~100-200MB
   - Puppeteer/Chromium: ~300-500MB
   - WhatsApp Web client: ~100-200MB
   - Buffer for operation: ~200MB

3. **Storage Requirements**:

   - OS and dependencies: ~2-3GB
   - Application code: <50MB
   - WhatsApp session data: ~100MB
   - Logs and temporary files: ~500MB
   - Buffer for updates: ~1GB

4. **Network Requirements**:
   - Persistent connection to WhatsApp servers
   - Occasional API calls to Gemini API
   - Standard egress for logs and monitoring

## Recommended GCP Instance Types

### Minimum Viable Configuration

- **Machine Type**: e2-micro (2 vCPUs, 1GB memory)
- **Disk**: 10GB Standard Persistent Disk
- **Region**: Choose based on your location for lowest latency
- **OS**: Ubuntu 22.04 LTS

This configuration will work for low to moderate usage (a few groups with occasional messages).

### Recommended Configuration

- **Machine Type**: e2-small (2 vCPUs, 2GB memory)
- **Disk**: 10GB Standard Persistent Disk
- **Region**: Choose based on your location for lowest latency
- **OS**: Ubuntu 22.04 LTS

This configuration provides better performance and stability, especially when handling multiple groups or higher message volumes.

### High-Usage Configuration

- **Machine Type**: e2-medium (2 vCPUs, 4GB memory)
- **Disk**: 20GB Standard Persistent Disk
- **Region**: Choose based on your location for lowest latency
- **OS**: Ubuntu 22.04 LTS

This configuration is recommended if the bot will be handling many groups or high message volumes.

## Cost Considerations

As of April 2025, approximate monthly costs (may vary by region):

- e2-micro: ~$8-10/month
- e2-small: ~$15-18/month
- e2-medium: ~$30-35/month

These costs are estimates and may vary based on actual usage, region, and any applicable discounts.

## Optimization Tips

1. **Spot Instances**: Consider using spot instances for non-critical deployments to reduce costs by up to 60-80%.

2. **Sustained Use Discounts**: GCP automatically applies discounts for instances that run for a significant portion of the billing month.

3. **Preemptible VMs**: If occasional downtime is acceptable, preemptible VMs can reduce costs significantly.

4. **Resource Monitoring**: Set up monitoring to track resource usage and adjust instance size as needed.

## Conclusion

For most users, the e2-small instance (2 vCPUs, 2GB memory) provides the best balance of performance and cost for running the WhatsApp Roast Bot. This configuration ensures stable operation while keeping costs reasonable.

If budget is a primary concern, the e2-micro instance can work but may experience occasional performance issues during peak usage or when handling multiple groups simultaneously.
