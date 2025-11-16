import { COMPANY } from "../config/company.js";
import { zonedTimeToUtc, utcToZonedTime } from "./tzutil.js";

export function isWithinBusinessHours(now: Date = new Date()): boolean {
	const tz = COMPANY.timezone;
	const localNow = utcToZonedTime(now, tz);
	const day = localNow.getDay();

	if (!COMPANY.businessHours.days.includes(day)) return false;

	const open = new Date(localNow);
	open.setHours(COMPANY.businessHours.open.hour, COMPANY.businessHours.open.minute, 0, 0);
	const close = new Date(localNow);
	close.setHours(COMPANY.businessHours.close.hour, COMPANY.businessHours.close.minute, 0, 0);

	return localNow >= open && localNow <= close;
}

export function nextBusinessOpen(now: Date = new Date()): Date {
	const tz = COMPANY.timezone;
	let local = utcToZonedTime(now, tz);
	for (let i = 0; i < 14; i++) {
		const day = local.getDay();
		const isBusinessDay = COMPANY.businessHours.days.includes(day);
		const openAt = new Date(local);
		openAt.setHours(COMPANY.businessHours.open.hour, COMPANY.businessHours.open.minute, 0, 0);
		const closeAt = new Date(local);
		closeAt.setHours(COMPANY.businessHours.close.hour, COMPANY.businessHours.close.minute, 0, 0);
		if (isBusinessDay && local < openAt) return zonedTimeToUtc(openAt, tz);
		if (isBusinessDay && local >= openAt && local <= closeAt) return zonedTimeToUtc(local, tz);
		// move to next day 00:00
		local = new Date(local.getFullYear(), local.getMonth(), local.getDate() + 1, 0, 0, 0, 0);
	}
	return now;
}

