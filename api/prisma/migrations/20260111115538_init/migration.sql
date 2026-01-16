-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('DRAFT', 'APROVED');

-- CreateEnum
CREATE TYPE "public"."GameUserRole" AS ENUM ('MEMBER', 'CREATOR');

-- CreateEnum
CREATE TYPE "public"."GameUserStatus" AS ENUM ('INVITED', 'CONFIRMED', 'REJECTED', 'REQUESTED', 'ALLOWED', 'DECLINED');

-- CreateEnum
CREATE TYPE "public"."RequestMode" AS ENUM ('PRIVATE', 'MODERATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "public"."GameLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "public"."GameTimeFrame" AS ENUM ('UPCOMING', 'PAST', 'ALL');

-- CreateEnum
CREATE TYPE "public"."CalendarRepeatMode" AS ENUM ('ONCE', 'DAILY', 'WEEKLY', 'CALENDDAYS', 'WEEKDAYS');

-- CreateEnum
CREATE TYPE "public"."WorkTimeMode" AS ENUM ('TIMEGRID', 'CUSTOM', 'DAILY', 'NONE');

-- CreateEnum
CREATE TYPE "public"."ScheduleStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "public"."City" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "region" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timeStart" INTEGER NOT NULL DEFAULT 0,
    "timeEnd" INTEGER NOT NULL DEFAULT 0,
    "date" DATE NOT NULL,
    "status" "public"."GameStatus" NOT NULL DEFAULT 'DRAFT',
    "level" "public"."GameLevel" NOT NULL DEFAULT 'EASY',
    "countMembersMin" INTEGER NOT NULL DEFAULT 0,
    "countMembersMax" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "requestMode" "public"."RequestMode" NOT NULL DEFAULT 'PRIVATE',
    "placeId" TEXT NOT NULL,
    "sportId" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameUser" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."GameUserRole" NOT NULL,
    "status" "public"."GameUserStatus" NOT NULL,

    CONSTRAINT "GameUser_pkey" PRIMARY KEY ("gameId","userId")
);

-- CreateTable
CREATE TABLE "public"."Place" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "ownerId" TEXT NOT NULL,
    "isIndoor" BOOLEAN DEFAULT false,
    "isFree" BOOLEAN DEFAULT false,
    "cityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaceFavorite" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "PlaceFavorite_pkey" PRIMARY KEY ("userId","placeId")
);

-- CreateTable
CREATE TABLE "public"."PlaceCovers" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaceCovers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaceSport" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sportId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "PlaceSport_pkey" PRIMARY KEY ("sportId","placeId")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "placeId" TEXT NOT NULL,
    "startDate" DATE,
    "stopDate" DATE,
    "name" TEXT NOT NULL DEFAULT '',
    "repeatMode" "public"."CalendarRepeatMode" NOT NULL DEFAULT 'WEEKDAYS',
    "repeatStep" INTEGER NOT NULL DEFAULT 1,
    "m1" BOOLEAN DEFAULT false,
    "m2" BOOLEAN DEFAULT false,
    "m3" BOOLEAN DEFAULT false,
    "m4" BOOLEAN DEFAULT false,
    "m5" BOOLEAN DEFAULT false,
    "m6" BOOLEAN DEFAULT false,
    "m7" BOOLEAN DEFAULT false,
    "m8" BOOLEAN DEFAULT false,
    "m9" BOOLEAN DEFAULT false,
    "m10" BOOLEAN DEFAULT false,
    "m11" BOOLEAN DEFAULT false,
    "m12" BOOLEAN DEFAULT false,
    "w1" BOOLEAN DEFAULT false,
    "w2" BOOLEAN DEFAULT false,
    "w3" BOOLEAN DEFAULT false,
    "w4" BOOLEAN DEFAULT false,
    "wLast" BOOLEAN DEFAULT false,
    "wd1" BOOLEAN DEFAULT false,
    "wd2" BOOLEAN DEFAULT false,
    "wd3" BOOLEAN DEFAULT false,
    "wd4" BOOLEAN DEFAULT false,
    "wd5" BOOLEAN DEFAULT false,
    "wd6" BOOLEAN DEFAULT false,
    "wd7" BOOLEAN DEFAULT false,
    "d1" BOOLEAN DEFAULT false,
    "d2" BOOLEAN DEFAULT false,
    "d3" BOOLEAN DEFAULT false,
    "d4" BOOLEAN DEFAULT false,
    "d5" BOOLEAN DEFAULT false,
    "d6" BOOLEAN DEFAULT false,
    "d7" BOOLEAN DEFAULT false,
    "d8" BOOLEAN DEFAULT false,
    "d9" BOOLEAN DEFAULT false,
    "d10" BOOLEAN DEFAULT false,
    "d11" BOOLEAN DEFAULT false,
    "d12" BOOLEAN DEFAULT false,
    "d13" BOOLEAN DEFAULT false,
    "d14" BOOLEAN DEFAULT false,
    "d15" BOOLEAN DEFAULT false,
    "d16" BOOLEAN DEFAULT false,
    "d17" BOOLEAN DEFAULT false,
    "d18" BOOLEAN DEFAULT false,
    "d19" BOOLEAN DEFAULT false,
    "d20" BOOLEAN DEFAULT false,
    "d21" BOOLEAN DEFAULT false,
    "d22" BOOLEAN DEFAULT false,
    "d23" BOOLEAN DEFAULT false,
    "d24" BOOLEAN DEFAULT false,
    "d25" BOOLEAN DEFAULT false,
    "d26" BOOLEAN DEFAULT false,
    "d27" BOOLEAN DEFAULT false,
    "d28" BOOLEAN DEFAULT false,
    "d29" BOOLEAN DEFAULT false,
    "d30" BOOLEAN DEFAULT false,
    "d31" BOOLEAN DEFAULT false,
    "dLast" BOOLEAN DEFAULT false,
    "workTimeMode" "public"."WorkTimeMode" NOT NULL DEFAULT 'TIMEGRID',
    "minDurationHours" INTEGER NOT NULL DEFAULT 0,
    "minDurationMinutes" INTEGER NOT NULL DEFAULT 0,
    "maxDurationHours" INTEGER NOT NULL DEFAULT 0,
    "maxDurationMinutes" INTEGER NOT NULL DEFAULT 0,
    "timeStart" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."ScheduleStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeSlot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timeStart" INTEGER NOT NULL DEFAULT 0,
    "timeEnd" INTEGER NOT NULL DEFAULT 0,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "idx" SERIAL NOT NULL,
    "email" TEXT,
    "keycloakId" TEXT NOT NULL,
    "telegramId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserFavorite" (
    "userId" TEXT NOT NULL,
    "favoriteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("userId","favoriteId")
);

-- CreateTable
CREATE TABLE "public"."UserSport" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSport_pkey" PRIMARY KEY ("sportId","userId")
);

-- CreateTable
CREATE TABLE "public"."UserTgLinker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTgLinker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Game_date_idx" ON "public"."Game"("date");

-- CreateIndex
CREATE INDEX "Game_placeId_idx" ON "public"."Game"("placeId");

-- CreateIndex
CREATE INDEX "Game_placeId_date_idx" ON "public"."Game"("placeId", "date");

-- CreateIndex
CREATE INDEX "Game_status_idx" ON "public"."Game"("status");

-- CreateIndex
CREATE INDEX "Game_level_idx" ON "public"."Game"("level");

-- CreateIndex
CREATE INDEX "GameUser_gameId_idx" ON "public"."GameUser"("gameId");

-- CreateIndex
CREATE INDEX "GameUser_userId_idx" ON "public"."GameUser"("userId");

-- CreateIndex
CREATE INDEX "GameUser_role_idx" ON "public"."GameUser"("role");

-- CreateIndex
CREATE INDEX "GameUser_status_idx" ON "public"."GameUser"("status");

-- CreateIndex
CREATE INDEX "Place_isIndoor_idx" ON "public"."Place"("isIndoor");

-- CreateIndex
CREATE INDEX "Place_isFree_idx" ON "public"."Place"("isFree");

-- CreateIndex
CREATE INDEX "PlaceFavorite_userId_idx" ON "public"."PlaceFavorite"("userId");

-- CreateIndex
CREATE INDEX "PlaceFavorite_placeId_idx" ON "public"."PlaceFavorite"("placeId");

-- CreateIndex
CREATE INDEX "PlaceCovers_placeId_idx" ON "public"."PlaceCovers"("placeId");

-- CreateIndex
CREATE INDEX "PlaceSport_sportId_idx" ON "public"."PlaceSport"("sportId");

-- CreateIndex
CREATE INDEX "PlaceSport_placeId_idx" ON "public"."PlaceSport"("placeId");

-- CreateIndex
CREATE INDEX "Schedule_status_idx" ON "public"."Schedule"("status");

-- CreateIndex
CREATE INDEX "Schedule_rank_idx" ON "public"."Schedule"("rank");

-- CreateIndex
CREATE INDEX "Schedule_placeId_idx" ON "public"."Schedule"("placeId");

-- CreateIndex
CREATE INDEX "Schedule_startDate_idx" ON "public"."Schedule"("startDate");

-- CreateIndex
CREATE INDEX "Schedule_stopDate_idx" ON "public"."Schedule"("stopDate");

-- CreateIndex
CREATE INDEX "TimeSlot_scheduleId_idx" ON "public"."TimeSlot"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_idx_key" ON "public"."User"("idx");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_keycloakId_key" ON "public"."User"("keycloakId");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "public"."User"("telegramId");

-- CreateIndex
CREATE INDEX "User_keycloakId_idx" ON "public"."User"("keycloakId");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "public"."User"("telegramId");

-- CreateIndex
CREATE INDEX "UserFavorite_userId_idx" ON "public"."UserFavorite"("userId");

-- CreateIndex
CREATE INDEX "UserFavorite_favoriteId_idx" ON "public"."UserFavorite"("favoriteId");

-- CreateIndex
CREATE INDEX "UserSport_sportId_idx" ON "public"."UserSport"("sportId");

-- CreateIndex
CREATE INDEX "UserSport_userId_idx" ON "public"."UserSport"("userId");

-- CreateIndex
CREATE INDEX "UserTgLinker_userId_idx" ON "public"."UserTgLinker"("userId");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameUser" ADD CONSTRAINT "GameUser_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameUser" ADD CONSTRAINT "GameUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Place" ADD CONSTRAINT "Place_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Place" ADD CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceFavorite" ADD CONSTRAINT "PlaceFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceFavorite" ADD CONSTRAINT "PlaceFavorite_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceCovers" ADD CONSTRAINT "PlaceCovers_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceSport" ADD CONSTRAINT "PlaceSport_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceSport" ADD CONSTRAINT "PlaceSport_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlot" ADD CONSTRAINT "TimeSlot_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavorite" ADD CONSTRAINT "UserFavorite_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSport" ADD CONSTRAINT "UserSport_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSport" ADD CONSTRAINT "UserSport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
